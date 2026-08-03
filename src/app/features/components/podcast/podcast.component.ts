import { Component } from '@angular/core';
import { Button } from '@ntv360/component-pantry';

/**
 * Podcast section component with audio visualizer and streaming links.
 */
@Component({
  selector: 'app-podcast',
  standalone: true,
  imports: [Button],
  templateUrl: './podcast.component.html',
  styleUrl: './podcast.component.scss',
})
export class PodcastComponent {
  /** Smooth scroll to contact section */
  protected scrollToContact(): void {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }
}
