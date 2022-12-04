import { Request, Response } from 'express';
import NotificationsService from '../services/notifications';

class NotificationsController {
  static sendNotification = async (req: Request, res: Response, next: any) => {
    try {
      await NotificationsService.send(req.body);
      res.status(200).json({
        status: true,
        message: 'Notification sent',
      });
    } catch (e: any) {
      res
        .status(e.statusCode || 500)
        .json({
          message: e.message,
        })
        .end();
    }
  };
}

export default NotificationsController;
