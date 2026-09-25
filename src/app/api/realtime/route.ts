import { NextRequest } from 'next/server';
import { realtimeBroadcaster } from '@/lib/realtime';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection packet
      const initPayload = JSON.stringify({
        type: 'connected',
        timestamp: new Date().toISOString(),
      });
      controller.enqueue(encoder.encode(`data: ${initPayload}\n\n`));

      // Subscribe to real-time broadcaster
      const unsubscribe = realtimeBroadcaster.subscribe((message) => {
        try {
          const payload = JSON.stringify(message);
          controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
        } catch (err) {
          console.error('Error sending SSE message:', err);
        }
      });

      // Keepalive heartbeat every 25 seconds
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        } catch (err) {
          clearInterval(heartbeat);
        }
      }, 25000);

      // Cleanup on disconnect
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        unsubscribe();
        try {
          controller.close();
        } catch (err) {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
