import { Injectable } from '@nestjs/common';

export interface Post {
  id: number;
  title: string;
  content: string;
}

@Injectable()
export class PostService {
  private posts: Post[] = [
    { id: 1, title: 'Hello NestJS', content: 'This is a post about NestJS' },
    { id: 2, title: 'Hello tRPC', content: 'This is a post about tRPC' },
  ];

  findAll(): Post[] {
    return this.posts;
  }

  findOne(id: number): Post | undefined {
    return this.posts.find((post) => post.id === id);
  }

  create(title: string, content: string): Post {
    const newPost = { id: this.posts.length + 1, title, content };
    this.posts.push(newPost);
    return newPost;
  }
}
