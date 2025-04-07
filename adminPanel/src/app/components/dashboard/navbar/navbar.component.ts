import { Component,EventEmitter, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule,MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  constructor(private authService: AuthService){}

  @Output() toggleStateEvent = new EventEmitter<string>();

  toggleState(state: string){
    this.toggleStateEvent.emit(state);
  }

  Loggout(){
    this.authService.logout().subscribe(
      {
        next:(res :any)=>{
          console.log(res);
          localStorage.removeItem('token');
          window.location.href = '/login';
        },
        error:(err :any)=>{
          console.log(err);
        }
      }
    );
  }

}
