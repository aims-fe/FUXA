import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { map } from 'rxjs';

import { EndPointApi } from '../_helpers/endpointapi';
import { environment } from '../../environments/environment';
// import equipmentUtils from '../../utils/equipmentUtils';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ASmartService {
    @Output() onPluginsChanged: EventEmitter<any> = new EventEmitter();

    private endPointConfig: string = EndPointApi.getURL();

    constructor(
        private http: HttpClient,
        private translateService: TranslateService,
        private toastr: ToastrService
    ) {}

    getEquipsValues(equipCodes: string[]) {
        const params = { equipmentCodes: equipCodes.join(',') };
        return this.http.get<any>(
            `${this.endPointConfig}${environment.monitorAPI}/monitor/equipment/realtime-data`,
            { params }
        );
    }

    uploadFile(file: File) {
        // const headers = new HttpHeaders({Accept: 'multipart/form-data'});
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(
            `${this.endPointConfig}${environment.fileAPI}/files/anon`,
            formData
        );
    }
}
