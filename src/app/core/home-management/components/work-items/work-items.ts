import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ApplicationUserInterface } from '../../../interface/application-user/application-users-interface';
import { WorkItemInterface } from '../../../interface/work-item/work-item-interface';
import { WorkItemRequestInterface } from '../../../interface/work-item/work-item-request-interface';
import { UserProfileService } from '../../../services/user-profile-service';
import { WorkItemService } from '../../../services/work-item-service';

@Component({
  selector: 'app-work-items',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, CardModule, InputTextModule],
  templateUrl: './work-items.html',
  styleUrl: './work-items.scss'
})
export class WorkItems implements OnInit {
  private readonly workItemService = inject(WorkItemService);
  private readonly userProfileService = inject(UserProfileService);
  private readonly messageService = inject(MessageService);

  items: WorkItemInterface[] = [];
  users: ApplicationUserInterface[] = [];
  editingId: string | null = null;
  loading = true;
  saving = false;

  get hasDoneItems(): boolean {
    return this.items.some(item => item.isDone);
  }

  readonly form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(200)] }),
    priority: new FormControl(false, { nonNullable: true }),
    assignedToUserId: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  ngOnInit(): void {
    forkJoin({
      items: this.workItemService.getAll(),
      users: this.userProfileService.getHouseholdUsers()
    }).subscribe({
      next: ({ items, users }) => {
        this.items = items;
        this.users = users;
        const currentEmail = sessionStorage.getItem('login');
        const currentUser = users.find(user => user.email === currentEmail) ?? users[0];
        if (currentUser)
          this.form.controls.assignedToUserId.setValue(currentUser.id);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.showError('Nie udało się pobrać zadań.');
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const current = this.editingId ? this.items.find(item => item.id === this.editingId) : undefined;
    const request: WorkItemRequestInterface = {
      title: this.form.controls.title.value.trim(),
      priority: this.form.controls.priority.value,
      isDone: current?.isDone ?? false,
      assignedToUserId: this.form.controls.assignedToUserId.value
    };

    this.saving = true;
    const operation = this.editingId
      ? this.workItemService.update(this.editingId, request)
      : this.workItemService.create(request);

    operation.subscribe({
      next: (saved) => {
        const index = this.items.findIndex(item => item.id === saved.id);
        if (index === -1)
          this.items = [...this.items, saved];
        else
          this.items = this.items.map(item => item.id === saved.id ? saved : item);
        this.cancelEdit();
        this.saving = false;
      },
      error: () => {
        this.saving = false;
        this.showError('Nie udało się zapisać zadania.');
      }
    });
  }

  edit(item: WorkItemInterface): void {
    this.editingId = item.id;
    this.form.setValue({
      title: item.title,
      priority: item.priority,
      assignedToUserId: item.assignedToUserId
    });
  }

  cancelEdit(): void {
    const assignee = this.form.controls.assignedToUserId.value || this.users[0]?.id || '';
    this.editingId = null;
    this.form.reset({ title: '', priority: false, assignedToUserId: assignee });
  }

  toggleDone(item: WorkItemInterface): void {
    this.workItemService.update(item.id, { ...item, isDone: !item.isDone }).subscribe({
      next: (updated) => this.items = this.items.map(value => value.id === updated.id ? updated : value),
      error: () => this.showError('Nie udało się zmienić statusu zadania.')
    });
  }

  delete(item: WorkItemInterface): void {
    this.workItemService.delete(item.id).subscribe({
      next: () => this.items = this.items.filter(value => value.id !== item.id),
      error: () => this.showError('Nie udało się usunąć zadania.')
    });
  }

  clearDone(): void {
    this.workItemService.deleteDone().subscribe({
      next: () => this.items = this.items.filter(item => !item.isDone),
      error: () => this.showError('Nie udało się usunąć wykonanych zadań.')
    });
  }

  userEmail(userId: string): string {
    return this.users.find(user => user.id === userId)?.email ?? 'Nieznany użytkownik';
  }

  private showError(detail: string): void {
    this.messageService.add({ severity: 'error', summary: 'Błąd', detail });
  }
}
