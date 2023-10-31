import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
 
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
}) 

export class DialogComponent implements OnInit {

  categoryQualityList = [
    'Brand New', 'Second Hand', 'Referbished'
  ]

  actionBtn: string = 'Save'
  title : string = 'Add Product Form'

  constructor( 
    private fb: FormBuilder, 
    private apiService: ApiService, 
    private dialogRef: MatDialogRef<DialogComponent>,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public editData: any 
    ) {}

  productForm = this.fb.group({
    productName: ['', Validators.required],
    productCategory : ['', Validators.required],
    productModel: ['', Validators.required],
    date: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
  })

  ngOnInit(): void {
    if(this.editData){
      this.actionBtn = 'Update';
      this.title = 'Edit Product Form';
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['productCategory'].setValue(this.editData.productCategory);
      this.productForm.controls['productModel'].setValue(this.editData.productModel);
      this.productForm.controls['date'].setValue(this.editData.date);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['description'].setValue(this.editData.description);
    }
  }

  onSubmit(){
    if(!this.editData){
      if(this.productForm.valid){
        this.apiService.postProduct(this.productForm.value).subscribe({
          next:(res)=>{
            this.toastr.success('Product Added Successfully', 'Hooray...')
            this.productForm.reset();
            this.dialogRef.close('save');
          },
          error:()=>{
            this.toastr.success('Error in Adding Product', 'Oops...')
          }
        })
      }
    } else {
      this.updateProduct();
    }
  }

  updateProduct(){
    this.apiService.updateProduct(this.productForm.value, this.editData.id)
      .subscribe({
        next : (res) =>{
          this.toastr.success('Product Updated Successfully', 'Hooray...');
          this.productForm.reset();
          this.dialogRef.close('update');
        },
        error:() => {
          this.toastr.error('Error While Updating the Record', 'Oops...');
        }
      })
  }
}