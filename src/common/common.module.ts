import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; // Import JwtModule
import { EmailService } from './email.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'your_jwt_secret', // Replace with your secret key or use environment variable
      signOptions: { expiresIn: '1h' }, // Set expiration for tokens
    }),
  ],
  providers: [EmailService],
  exports: [EmailService], // Export EmailService to use it in other modules
})
export class CommonModule {}
