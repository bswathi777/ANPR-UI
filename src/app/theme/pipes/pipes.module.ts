import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaginationPipe} from './pagination/pagination.pipe';
import { ProfilePicturePipe } from './profilePicture/profilePicture.pipe';
import { CompanySearchPipe } from './search/company-search.pipe';
import { TruncatePipe } from './truncate/truncate.pipe';
import { MailSearchPipe } from './search/mail-search.pipe';
import { CameraSearchPipe } from './search/camera-search.pipe';

@NgModule({
    imports: [ 
        CommonModule 
    ],
    declarations: [
        PaginationPipe,
        ProfilePicturePipe,
        CameraSearchPipe,
        CompanySearchPipe,
        TruncatePipe,
        MailSearchPipe
    ],
    exports: [
        PaginationPipe,
        ProfilePicturePipe,
        CameraSearchPipe,
        CompanySearchPipe,
        TruncatePipe,
        MailSearchPipe
    ]
})
export class PipesModule { }
