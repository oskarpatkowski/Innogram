import { Controller } from '@nestjs/common';
import { CommentsService } from '../services/comments.service';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
}
