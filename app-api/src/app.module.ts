import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesModule } from './modules/employees/employees.module';
import { Employee } from './modules/employees/employees.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // Type de base de données
      host: 'localhost', // Hôte de la base de données
      port: 3306, // Port MySQL (par défaut 3306)
      username: 'root', // Ton nom d'utilisateur MySQL
      password: 'wonder1000', // Ton mot de passe MySQL
      database: 'db', // Nom de la base de données
      entities: [Employee],
      synchronize: true, // À ne pas activer en production (évite de perdre des données)
    }),
    EmployeesModule,
  ],
})
export class AppModule {}
