import { Inject } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from 'src/notifications/notifications.service';

@WebSocketGateway({
    cors: {
        origin: 'http://localhost:3000', // URL chính xác của frontend
        methods: ['GET', 'POST'],
        credentials: true,
    },
})
export class JobNotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    private userConnections: Map<string, Set<Socket>> = new Map();

    // Khi server khởi tạo, log ra để xác nhận WebSocket đang chạy
    constructor(
        @Inject(NotificationsService) private readonly notificationsService: NotificationsService, // Tiêm NotificationsService

    ) {
        console.log('WebSocket Gateway is running...');
    }

    // Khi một client kết nối
    handleConnection(client: Socket) {
        const userId = client.handshake.query.userId as string;

        // Log khi có client kết nối
        console.log(`New client connected with userId: ${userId} | Socket ID: ${client.id}`);

        if (userId) {
            if (!this.userConnections.has(userId)) {
                this.userConnections.set(userId, new Set());
            }
            this.userConnections.get(userId)?.add(client);
        }
    }

    // Khi một client ngắt kết nối
    handleDisconnect(client: Socket) {
        const userId = client.handshake.query.userId as string;

        // Log khi có client ngắt kết nối
        console.log(`Client disconnected with userId: ${userId} | Socket ID: ${client.id}`);

        if (userId && this.userConnections.has(userId)) {
            this.userConnections.get(userId)?.delete(client);
        }
    }

    async sendNotificationToHr(jobId: string, hrId: string, userId: string, message: string) {
        const hrClients = this.userConnections.get(hrId);
        try {
            const notificationData = {
                message,
                contentId: jobId,
                receiverId: hrId,
                senderId: userId,
                timestamp: new Date(),
            };

            // Gọi service để tạo notification
            await this.notificationsService.create(notificationData);
            console.log('Notification created and saved to DB');
        } catch (error) {
            console.error('Error creating notification:', error);
        }
        if (hrClients) {
            hrClients.forEach((client) => {
                console.log(`Sending notification to client ${client.id}`);  // Log khi gửi thông báo
                client.emit('jobNotification', {
                    message: message,
                    jobId: jobId,
                    userId: userId,
                    hrId: hrId,
                    timestamp: new Date(),
                });


            });

        } else {
            console.log(`No HR clients found for userId: ${hrId}`);
        }
    }
}
