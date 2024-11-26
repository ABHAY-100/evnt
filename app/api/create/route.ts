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
    throw new Error(`Invalid phone number format: ${phoneNumber}. Please ensure it follows the format +[country code][10 digits] (e.g., +919074943085)`);
  }
}

async function sendPrivateMessage(client: TelegramClient, user: any, message: string, retries = 3): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Attempt ${i + 1} to send private message`);
      
      // Try different methods to get the user entity
      let userEntity;
      try {
        userEntity = await client.getInputEntity(user.id);
      } catch (entityError) {
        console.log('Failed to get input entity, trying to get entity:', entityError.message);
        userEntity = await client.getEntity(user.id);
      }

      await client.sendMessage(userEntity, {
        message: message,
        parseMode: 'html',
        linkPreview: false
      });
      
      console.log('Message sent successfully');
      return true;
    } catch (error) {
      console.log(`Attempt ${i + 1} failed:`, error.message);
      if (i === retries - 1) {
        throw error;
      }
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  return false;
}

async function verifyUserInGroup(client: TelegramClient, channelId: string, userId: string): Promise<boolean> {
  try {
    console.log(`Verifying if user ${userId} is in group ${channelId}`);
    const participants = await client.invoke(new Api.channels.GetParticipants({
      channel: await client.getInputEntity(channelId),
      filter: new Api.ChannelParticipantsRecent({}),
      offset: 0,
      limit: 100,
      hash: 0n
    }));

    const isUserInGroup = participants.users.some((user: any) => user.id.toString() === userId.toString());
    console.log(`User ${userId} in group: ${isUserInGroup}`);
    return isUserInGroup;
  } catch (error) {
    console.error('Error verifying user in group:', error);
    return false;
  }
}

async function createGroup(
  client: TelegramClient,
  groupInfo: GroupInfo
): Promise<CreateGroupResponse> {
  try {
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

    const inviteResult = await client.invoke(new Api.messages.ExportChatInvite({
      peer: await client.getInputEntity(channelId),
      expire_date: undefined,
      usage_limit: undefined,
      title: undefined,
      request_needed: false
    }));

    const contactStatuses: ContactStatus[] = [];

    for (const contact of groupInfo.contacts) {
      try {
        if (contact.validationError) {
          contactStatuses.push({
            ...contact,
            status: 'validation_failed',
            error: contact.validationError
          });
          continue;
        }

        let user;
        try {
          user = await importContactAndGetEntity(client, contact.phoneNumber);
        } catch (importErr) {
          contactStatuses.push({
            ...contact,
            status: 'error',
            error: importErr.message
          });
          continue;
        }

        if (!user) {
          contactStatuses.push({
            ...contact,
            status: 'no_account',
            error: 'No Telegram account found with this number'
          });
          continue;
        }

        try {
          console.log(`Attempting to add user ${contact.phoneNumber} to ${groupInfo.type}`);
          await client.invoke(new Api.channels.InviteToChannel({
            channel: await client.getInputEntity(channelId),
            users: [await client.getInputEntity(user.id)]
          }));

          // Verify if the user was actually added
          const isAdded = await verifyUserInGroup(client, channelId, user.id.toString());
          
          if (isAdded) {
            console.log(`Successfully verified user ${contact.phoneNumber} is in the group`);
            contactStatuses.push({
              ...contact,
              status: 'added'
            });
          } else {
            console.log(`Failed to verify user ${contact.phoneNumber} in group, attempting private message`);
            throw new Error('User not found in group after addition attempt');
          }
        } catch (err) {
          console.log(`Failed to add user ${contact.phoneNumber} directly. Error:`, err.message);
          try {
            console.log(`Attempting to send private message to user ${contact.phoneNumber}`);
            const groupType = groupInfo.type === 'channel' ? 'channel' : 'group';
            const message = `Hello! You've been invited to join the ${groupType} "${groupInfo.name}". Since your privacy settings prevent direct addition, here's your invitation link: ${inviteResult.link}\n\nDescription: ${groupInfo.description || 'No description provided'}`;
            
            const messageSent = await sendPrivateMessage(client, user, message);
            
            if (messageSent) {
              console.log(`Successfully sent private message to user ${contact.phoneNumber}`);
              contactStatuses.push({
                ...contact,
                status: 'invited',
                inviteLink: inviteResult.link
              });
            } else {
              throw new Error('Failed to send message after retries');
            }
          } catch (msgError) {
            console.log(`Failed to send private message to user ${contact.phoneNumber}. Error:`, msgError.message);
            let errorMessage = 'Could not add user or send invitation';

            if (err instanceof Error) {
              if (err.message.includes('privacy')) {
                errorMessage = `User has restricted who can add them to groups. ${msgError.message.includes('USER_PRIVACY_RESTRICTED') ? 'Could not send invite link due to messaging restrictions.' : 'Attempted to send invite link via private message but failed.'}`;
              } else if (err.message.includes('PEER_FLOOD')) {
                errorMessage = 'Too many requests. Please try again later';
              } else if (err.message.includes('USER_PRIVACY_RESTRICTED')) {
                errorMessage = 'User has restricted who can message them. Could not send invite link.';
              } else if (err.message === 'User not found in group after addition attempt') {
                errorMessage = 'Failed to add user to group. Privacy settings may be restricted.';
              }
            }

            console.log(`Final error message for user ${contact.phoneNumber}:`, errorMessage);
            contactStatuses.push({
              ...contact,
              status: 'error',
              error: errorMessage
            });
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
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
      contactStatuses: groupInfo.contacts.map((contact) => ({
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
    const groupInfo = (await request.json()) as GroupInfo;

    if (!groupInfo.name || !groupInfo.contacts || !groupInfo.contacts.length) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input: name and contacts are required'
        },
        { status: 400 }
      );
    }

    const result = await createGroup(client, groupInfo);
    return NextResponse.json(result);
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
