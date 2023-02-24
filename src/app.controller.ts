import { Controller, Post, RawBodyRequest, Req, Res } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import { Request, Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Chatwork Webhook 用のエンドポイントです。
   * @param req Express リクエストオブジェクト
   * @param res Express レスポンスオブジェクト
   */
  @Post('api/v1/chatwork/webhook')
  onApiV1ChatworkWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    // リクエスト署名を検証します。
    const webhookToken = process.env.WEBHOOK_TOKEN;
    const privateKey = Buffer.from(webhookToken, 'base64');
    const actualSignature = createHmac('sha256', privateKey)
      .update(req.rawBody)
      .digest('base64');

    const expectedSignature = req.headers[
      'x-chatworkwebhooksignature'
    ] as string;

    const isSignatureVerified = timingSafeEqual(
      Buffer.from(actualSignature),
      Buffer.from(expectedSignature),
    );

    if (!isSignatureVerified) {
      res.status(400).send('Bad Request: !isSignatureVerified');
      console.warn(JSON.stringify({ actualSignature, expectedSignature }));
      return;
    }

    // リクエストの内容を出力します。
    console.info(req.rawBody.toString());

    res.status(200).end('OK');
  }
}
