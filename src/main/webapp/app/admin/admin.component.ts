import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'environments/environment';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  environment = environment;
}
