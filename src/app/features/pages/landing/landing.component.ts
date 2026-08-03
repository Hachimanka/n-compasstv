import { Component } from '@angular/core';
import { ContactComponent } from '../../contact/contact.component';
import { FooterComponent } from '../../footer/footer.component';
import { HeroComponent } from '../../hero/hero.component';
import { ModelsComponent } from '../../models/models.component';
import { PodcastComponent } from '../../podcast/podcast.component';
import { TestimonialsComponent } from '../../testimonials/testimonials.component';
import { ServicesComponent } from '../../services/services.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [HeroComponent, ModelsComponent, ServicesComponent, PodcastComponent, TestimonialsComponent, ContactComponent, FooterComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {}