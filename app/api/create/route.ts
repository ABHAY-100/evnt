import { NextResponse } from 'next/server';
import { TelegramClient } from 'telegram';
import { Api } from 'telegram/tl';
import { getTelegramClient } from '@/utils/telegram-client';
import { BigInteger } from 'telegram';
import { ContactEntry } from '@/utils/csv-parser';
import { ContactStatus } from '@/utils/report-generator';

interface GroupInfo {
  type: 'channel' | 'group';
  name: string;
  description?: string;
  contacts: ContactEntry[];
}

interface CreateGroupResponse {
  success: boolean;
  channelId?: string;
  inviteLink?: string;
  contactStatuses: ContactStatus[];
  error?: string;
}

async function importContactAndGetEntity(client: TelegramClient, phoneNumber: string) {
  try {
    // First try to resolve the phone number directly
    try {
      const result = await client.invoke(new Api.contacts.ResolvePhone({
        phone: phoneNumber.replace('+', '')
      }));
      if (result.peer) {
        const user = await client.getEntity(result.peer);
        return user;
      }
    } catch (err) {
      console.log('Could not resolve phone directly:', err);
      console.log('Trying import method...');
    }

    // If direct resolution fails, try importing
    const importResult = await client.invoke(new Api.contacts.ImportContacts({
      contacts: [new Api.InputPhoneContact({
        clientId: BigInteger.fromValue(1),
        phone: phoneNumber,
        firstName: 'User',
        lastName: ''
      })]
    }));

    if (!importResult?.users?.[0]) {
      throw new Error(`No user found for phone number ${phoneNumber}`);
    }

    return importResult.users[0];
  } catch (err) {
    console.error(`Error importing contact ${phoneNumber}:`, err);
    throw new Error(`Failed to import contact: ${(err as Error).message}`);
  }
}

async function createGroup(client: TelegramClient, groupInfo: GroupInfo): Promise<CreateGroupResponse> {
  try {
    // Create the group using MTProto API
    const createResult = await client.invoke(new Api.channels.CreateChannel({
      title: groupInfo.name,
      about: groupInfo.description,
      megagroup: groupInfo.type === 'group',
      broadcast: groupInfo.type === 'channel'
    }));

    if (!createResult.chats?.[0]) {
      throw new Error('Failed to create channel: No chat object returned');
    }

    const channel = createResult.chats[0];
    const channelId = channel.id.toString();

    // Generate invite link
    const inviteResult = await client.invoke(new Api.messages.ExportChatInvite({
      peer: await client.getInputEntity(channelId),
      expire_date: undefined,
      usage_limit: undefined,
      title: undefined,
      request_needed: false
    }));

    const contactStatuses: ContactStatus[] = [];

    // Process each contact
    for (const contact of groupInfo.contacts) {
      try {
        // If there's a validation error, add it to the status directly
        if (contact.validationError) {
          contactStatuses.push({
            ...contact,
            status: 'validation_failed',
            error: contact.validationError
          });
          continue;
        }

        const user = await importContactAndGetEntity(client, contact.phoneNumber);
        
        if (!user) {
          contactStatuses.push({
            ...contact,
            status: 'no_account',
            error: 'No Telegram account found with this number'
          });
          continue;
        }

        try {
          // Try to add to group
          await client.invoke(new Api.channels.InviteToChannel({
            channel: await client.getInputEntity(channelId),
            users: [await client.getInputEntity(user.id)]
          }));
          
          contactStatuses.push({
            ...contact,
            status: 'added'
          });
        } catch (err) {
          // If failed to add (probably due to privacy settings), send private message
          try {
            await client.sendMessage(user, {
              message: `Hello! You've been invited to join ${groupInfo.name}. Click here to join: ${inviteResult.link}`
            });
            
            contactStatuses.push({
              ...contact,
              status: 'invited',
              inviteLink: inviteResult.link
            });
          } catch (msgError) {
            let errorMessage = 'Could not add user or send invitation';
            
            if (err instanceof Error) {
              if (err.message.includes('privacy')) {
                errorMessage = 'User has restricted who can add them to groups';
              } else if (err.message.includes('PEER_FLOOD')) {
                errorMessage = 'Too many requests. Please try again later';
              } else if (err.message.includes('USER_PRIVACY_RESTRICTED')) {
                errorMessage = 'User has restricted who can message them';
              }
            }
            
            contactStatuses.push({
              ...contact,
              status: 'error',
              error: errorMessage
            });
          }
        }
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (err) {
        let errorMessage = 'Failed to process contact';
        
        if (err instanceof Error) {
          if (err.message.includes('PHONE_NUMBER_INVALID')) {
            errorMessage = 'Invalid phone number format';
          } else if (err.message.includes('PHONE_NUMBER_BANNED')) {
            errorMessage = 'This number has been banned from Telegram';
          } else if (err.message.includes('USER_DEACTIVATED')) {
            errorMessage = 'Telegram account has been deactivated';
          } else {
            errorMessage = err.message;
          }
        }
        
        contactStatuses.push({
          ...contact,
          status: 'error',
          error: errorMessage
        });
      }
    }

    return {
      success: true,
      channelId,
      inviteLink: inviteResult.link,
      contactStatuses
    };
  } catch (err) {
    console.error('Error creating group:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      contactStatuses: groupInfo.contacts.map(contact => ({
        ...contact,
        status: 'error',
        error: 'Failed to create group'
      }))
    };
  }
}

export async function POST(request: Request) {
  try {
    const client = await getTelegramClient();
    const groupInfo = await request.json() as GroupInfo;

    if (!groupInfo.name || !groupInfo.contacts || !groupInfo.contacts.length) {
      return NextResponse.json(
        { success: false, error: 'Invalid input: name and contacts are required' },
        { status: 400 }
      );
    }

    const result = await createGroup(client, groupInfo);
    return NextResponse.json(result);
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
