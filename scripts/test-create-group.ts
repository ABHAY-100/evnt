async function testCreateGroup() {
    const groupInfo = {
        name: "Test Group",
        description: "This is a test group created via API",
        members: ["+917994178901", "+919074943085"],
        type: "group" // or "channel"
    };

    try {
        const response = await fetch('http://localhost:3000/api/create-group', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(groupInfo)
        });

        const result = await response.json();
        console.log('Response:', result);

        if (result.success) {
            console.log('Group created successfully!');
            console.log('Channel ID:', result.channelId);
            console.log('Invite Link:', result.inviteLink);
            console.log('Added Members:', result.addedMembers);
            if (result.failedMembers?.length > 0) {
                console.log('Failed Members:', result.failedMembers);
            }
        } else {
            console.error('Failed to create group:', result.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Make sure your Next.js development server is running before running this script
testCreateGroup().catch(console.error);
