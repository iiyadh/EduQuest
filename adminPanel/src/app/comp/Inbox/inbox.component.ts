import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { EmailsService } from '../../services/emails.service';

interface Email {
  id: string;
  name: string;
  email: string;
  subject: string;
  content: string;
  read: boolean;
}

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzListModule,
    NzIconModule,
    NzButtonModule
  ],
  templateUrl: "inbox.component.html",
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {
  emails: Email[] = [];
  selectedEmail: Email | null = null;

  constructor(private emailsService:EmailsService) { }


  loadEmails(): void {
    this.emails = this.emailsService.getEmails();
  }

  ngOnInit(): void {
    this.loadEmails();
  }

  handleRemoveReport(id: string) {
    this.emailsService.deleteEmail(id);
    this.loadEmails();
  }

  selectEmail(email: Email): void {
    this.selectedEmail = email;
    email.read = true;
  }

  refreshEmails():void{
    this.loadEmails();
    this.selectedEmail = null;
  }
}