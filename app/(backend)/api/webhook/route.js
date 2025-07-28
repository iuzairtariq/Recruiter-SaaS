// app/(backend)/api/webhook/route.js
import { verifyWebhook } from '@clerk/nextjs/webhooks';
import Recruiter from '@/models/Recruiter';
import connectDB from '@/lib/dbConnect';

export async function POST(req) {
    try {
        // 1. Clerk webhook verify
        const evt = await verifyWebhook(req);

        // 2. DB connect
        await connectDB();

        const { id: clerkRecruiterId, email_addresses, first_name, last_name, last_sign_in_at } = evt.data;
        const email = email_addresses?.[0]?.email_address || '';
        const fullName = [first_name, last_name].filter(Boolean).join(' ');

        switch (evt.type) {
            case 'user.created':
                // agar pehle se exist na karta ho
                await Recruiter.create({
                    clerkRecruiterId,
                    email,
                    fullName,
                    lastSignedIn: new Date(last_sign_in_at),
                });
                console.log(`Recruiter ${clerkRecruiterId} created`);
                break;

            case 'user.updated':
                // partial update
                await Recruiter.findOneAndUpdate(
                    { clerkRecruiterId },
                    {
                        email,
                        fullName,
                        lastSignedIn: last_sign_in_at ? new Date(last_sign_in_at) : undefined,
                    },
                    { new: true, upsert: true }
                );
                console.log(`Recruiter ${clerkRecruiterId} updated`);
                break;

            case 'user.deleted':
                await Recruiter.findOneAndDelete({ clerkRecruiterId });
                console.log(`Recruiter ${clerkRecruiterId} deleted`);
                break;

            default:
                console.log(`Unhandled event type ${evt.type}`);
        }

        return new Response('Webhook processed ✅', { status: 200 });
    } catch (err) {
        console.error('❌ Error in webhook handler:', err);
        return new Response('Error', { status: 400 });
    }
}
