import { Component, OnInit, Output } from '@angular/core';
import { PhotoAlbum } from '../../models/photoAlbum.model';
import { FileService } from 'src/app/services/file.service';
import { MyFile } from 'src/app/models/myFile.model';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css'],
})
export class AlbumsComponent implements OnInit{
  albums: Array<PhotoAlbum> = [];
  files:any = [];
  showFolderCreationDialog = false;
  showFileInformationDialog = false;
  currentpath:string = "";
  @Output() selectedFile!:MyFile;
  constructor(private fileService:FileService) {
  }
  
  ngOnInit(){
    this.fileService.getFolders().subscribe(
      {
        next: data => {
          let rootFolder = data["folders"]["SignedUserEmail"];
          this.currentpath = rootFolder + "/"
          console.log(data)
          for(let folder of data["folders"][rootFolder]){
            let album: PhotoAlbum = { name: folder, numberOfFiles: 5 };
            this.albums.push(album);
          }
          for(let file of data["files"]){
            let file_path = file.split("/")
            let file_name = file_path[file_path.length - 1]
            let pair = []
            pair.push(file_name)
            pair.push(file_name.split(".")[1])
            this.files.push(pair) 
          }
          console.log(this.files)
        },
        error(data) {

        }
      }
    )
  }

  addFolderClicked(){
    this.showFolderCreationDialog = true;
  }

  closeFolderDialog(){
    this.showFolderCreationDialog = false;
  }

  openDescription(file:any){
    this.fileService.getMetaData(this.currentpath + file[0]).subscribe({
      next: data => {
        console.log(data)
        let fileInfo: MyFile = {
          name: file[0],
          size: data.Item.size,
          creationDate: '12.12.2020',
          lastModifiedDate: data.Item.lastModified,
          type: data.Item.type,
          description: data.Item.description,
          tags: [],
        };
        this.selectedFile = fileInfo;
        this.showFileInformationDialog = true;
      },
      error: data => {

      }
    });
  }

  closeFileInformation(){
    this.showFileInformationDialog = false;
  }
}