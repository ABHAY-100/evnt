import { NextResponse } from 'next/server';
import { TelegramClient } from 'telegram';
import { Api } from 'telegram/tl';
import { StringSession } from 'telegram/sessions';
import { getTelegramClient } from '@/utils/telegram-client';

interface GroupInfo {
  name: string;
  description: string;
  members: string[];
  type: 'channel' | 'group';
}

interface CreateGroupResponse {
  success: boolean;
  channelId?: string;
  inviteLink?: string;
  addedMembers?: string[];
  failedMembers?: Array<{ phoneNumber: string; error: string }>;
  totalMembers?: number;
  successfullyAdded?: number;
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
        clientId: BigInt(1),
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

    // Add members using phone numbers
    const addedMembers: string[] = [];
    const failedMembers: Array<{ phoneNumber: string; error: string }> = [];

    for (const phoneNumber of groupInfo.members) {
      try {
        const user = await importContactAndGetEntity(client, phoneNumber);
        
        await client.invoke(new Api.channels.InviteToChannel({
          channel: await client.getInputEntity(channelId),
          users: [await client.getInputEntity(user.id)]
        }));
        
        addedMembers.push(phoneNumber);
        console.log(`Successfully added ${phoneNumber} to ${groupInfo.name}`);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (err) {
        console.error(`Failed to add member ${phoneNumber}:`, err);
        failedMembers.push({ phoneNumber, error: (err as Error).message });
      }
    }

    // Generate invite link
    const inviteResult = await client.invoke(new Api.messages.ExportChatInvite({
      peer: await client.getInputEntity(channelId),
      expire_date: undefined,
      usage_limit: undefined,
      title: undefined,
      request_needed: false
    }));

    return {
      success: true,
      channelId,
      inviteLink: inviteResult.link,
      addedMembers,
      failedMembers,
      totalMembers: groupInfo.members.length,
      successfullyAdded: addedMembers.length
    };
  } catch (err) {
    console.error('Error creating group:', err);
    return {
      success: false,
      error: (err as Error).message
    };
  }
}

export async function POST(request: Request) {
  try {
    const client = await getTelegramClient();
    const groupInfo = await request.json() as GroupInfo;

    if (!groupInfo.name || !groupInfo.members || !groupInfo.members.length) {
      return NextResponse.json(
        { success: false, error: 'Invalid input: name and members are required' },
        { status: 400 }
      );
    }

    const result = await createGroup(client, groupInfo);
    return NextResponse.json(result);
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
