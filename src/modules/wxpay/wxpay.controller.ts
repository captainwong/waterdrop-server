import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { StudentService } from '../student/student.service';
import { Response } from 'express';
import { CurrentTokenId } from '@/common/decorators/current-token-id.decorator';
import { AuthGuard } from '@/common/guards/auth.gard';
import { STUDENT_NOT_EXISTS } from '@/common/const/code';
import { CodeMsg } from '@/common/const/message';

@Controller('wxpay')
export class WxpayController {
  constructor(private readonly studentService: StudentService) {}

  @UseGuards(AuthGuard)
  @Get('login')
  async wxpayLogin(
    @CurrentTokenId('studentId') studentId: string,
    @Query('redirect') redirect: string,
    @Res() res: Response,
  ): Promise<void> {
    const student = await this.studentService.findOne(studentId);
    if (!student) {
      res
        .json({
          code: STUDENT_NOT_EXISTS,
          message: CodeMsg(STUDENT_NOT_EXISTS),
        })
        .end();
      return;
    }

    res.redirect(redirect);
  }
}
