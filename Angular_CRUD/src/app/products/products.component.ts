import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { MatSort} from '@angular/material/sort';
import { MatDialog} from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';



@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit {

  constructor(
    private apiService: ApiService, 
    private toastr: ToastrService,
    private dialog: MatDialog
    ) {}

  displayedColumns: string[] = 
  [
    'productName', 
    'productCategory', 
    'productModel', 
    'date', 
    'price', 
    'description',
    'action'
  ];

  dataSource = new MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit():void {
    this.getAllProducts();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '30%',
      disableClose: true
    }).afterClosed().subscribe((val)=>{
      this.getAllProducts();
    })
  }


  getAllProducts(){
    return this.apiService.getProduct().subscribe({
      next : (res) => {
        this.dataSource = new MatTableDataSource(res)
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort
      },
      error:(err) => {
        this.toastr.error('Error in fetching data', 'Oops...')
      }
    })
  }
  

  editProduct(row: any){
    this.dialog.open(DialogComponent,{
      width: '30%',
      disableClose: true,
      data: row
    }).afterClosed().subscribe((val) => {
      this.getAllProducts();
    })
  }

  deleteProduct(id:number){
    return this.apiService.deleteProduct(id).subscribe({
      next:(res) => {
        this.toastr.success('Product Deleted Successfully', 'Hooray...');
        this.getAllProducts();
      },
      error:()=>{
        this.toastr.error('Error in fetching data', 'Oops...')
      }
    })
  }
}
