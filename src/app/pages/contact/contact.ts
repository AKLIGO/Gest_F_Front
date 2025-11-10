import { Component,OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../services/ContactService';
import { FormGroup } from '@angular/forms';
import { ContactMessage } from '../../interfaces/ContactMessage';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact implements OnInit{
  contactForm!: FormGroup;

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: [''],
      message: ['', Validators.required],
    });
  }
  
  constructor(private fb: FormBuilder, private contactService:ContactService) {

  }

  successMsg = '';
  errorMsg = '';

    onSubmit() {
    if (this.contactForm.invalid) return;

    this.contactService.sendMessage(this.contactForm.value).subscribe({
      next: () => {
        this.successMsg = 'Message envoyé avec succès !';
        this.contactForm.reset();
      },
      error: () => (this.errorMsg = 'Erreur lors de l’envoi du message.')
    });
  }

}
