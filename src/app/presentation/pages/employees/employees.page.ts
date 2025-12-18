import { Component, ViewChild } from '@angular/core';
import { retry } from 'rxjs/operators';
import { DeleteEmployeeUseCase, SearchEmployeesUseCase } from '../../../application/usecases/employee.usecases';
import { Employee } from 'src/app/domain/models/employee.model';
import { AlertController, IonInfiniteScroll, ModalController } from '@ionic/angular';
import { EmployeeDetailPage } from '../employee-detail/employee-detail.page';
import { COUNT_RETRY, DELAY_RETRY, MESSAGE_DELETED } from 'src/app/core/constants/constants';


@Component({
  selector: 'app-employees',
  templateUrl: 'employees.page.html',
  styleUrls: ['employees.page.scss'],
  standalone: false,
})
export class EmployeesPage {
  @ViewChild(IonInfiniteScroll, { static: false })
  infiniteScroll!: IonInfiniteScroll;
  employees: Employee[] = [];        // vista actual
  allEmployees: Employee[] = [];     // cache sin búsqueda

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  searchTerm = '';
  isSearching = false;


  isLoading = false;
  isDarkMode = false;

  constructor(
    private modalCtrl: ModalController,
    private searchEmployeesUseCase: SearchEmployeesUseCase,
    private deleteEmployeeUseCase: DeleteEmployeeUseCase,
    private alertCtrl: AlertController
  ) { }


  ngOnInit() {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.isDarkMode = prefersDark.matches;
    this.applyTheme(this.isDarkMode);

    this.loadEmployees();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme(this.isDarkMode);
  }

  private applyTheme(isDark: boolean) {
    document.body.classList.toggle('ion-palette-dark', isDark);
  }


  loadEmployees(event?: any) {
    // Solo mostrar el skeleton si es la primera carga (página 1) y no es un infinite scroll
    if (this.currentPage === 1 && !event) {
      this.isLoading = true;
    }

    this.searchEmployeesUseCase
      .execute(this.searchTerm, this.currentPage, this.pageSize)
      .pipe(
        retry({ count: COUNT_RETRY, delay: DELAY_RETRY })
      )
      .subscribe({
        next: (response) => {
          const data = response.data || [];

          this.allEmployees =
            this.currentPage === 1
              ? data
              : [...this.allEmployees, ...data];

          this.employees = [...this.allEmployees];

          this.totalPages = Math.ceil(response.totalRecords / this.pageSize);

          this.isLoading = false;

          if (event) {
            event.target.complete();
          }
        },
        error: () => {
          this.isLoading = false;
          if (event) {
            event.target.complete();
          }
        }
      });
  }

  onSearch(event: any) {
    const value = event.target.value?.trim() || '';

    if (!value) {
      this.isSearching = false;
      this.searchTerm = '';
      this.currentPage = 1;
      this.loadEmployees();
      return;
    }

    this.isSearching = true;
    this.searchTerm = value;
    this.currentPage = 1;
    this.isLoading = true; // Show skeleton for search

    this.searchEmployeesUseCase
      .execute(value, 1, this.pageSize)
      .pipe(
        retry({ count: COUNT_RETRY, delay: DELAY_RETRY })
      )
      .subscribe({
        next: (response) => {
          this.employees = response.data || [];
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }

  loadMore(event: any) {
    if (this.isSearching) {
      event.target.complete();
      return;
    }
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadEmployees(event);
    } else {
      event.target.complete();
    }
  }

  async openDetail(id?: string) {
    const modal = await this.modalCtrl.create({
      component: EmployeeDetailPage,
      componentProps: {
        id: id ?? null
      },
      breakpoints: [0, 0.9],
      initialBreakpoint: 0.9
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.saved) {
      this.currentPage = 1;
      this.employees = [];
      this.searchTerm = '';
      this.isSearching = false;
      this.loadEmployees();

    }
  }


  async deleteEmployee(id?: string) {
    if (!id) return;

    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: MESSAGE_DELETED,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.deleteEmployeeUseCase.execute(id).subscribe(() => {
              this.employees = this.employees.filter(e => e.id !== id);
              this.allEmployees = this.allEmployees.filter(e => e.id !== id);
            });
          }
        }
      ]
    });

    await alert.present();
  }


}
