import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

import { EndPointApi } from '../_helpers/endpointapi';
import { environment } from '../../environments/environment';
import equipmentUtils from '../../utils/equipmentUtils';
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

    queryAllEquips() {
        // NOTE: 需要考虑单机部署的情况
        return this.http
            .get<any>(
                `${this.endPointConfig}${environment.urmsAPI}/e-equipment-base/page?pageSize=999&pageNo=1`
            )
            .pipe(map((data) => data?.data || []));
    }

    getEquipTags(equipCode: string) {
        return this.http
            .get<any>(
                `${this.endPointConfig}${environment.monitorAPI}/monitor/equipment/multiple-data?equipmentCode=${equipCode}`
            )
            .pipe(
                map((data: any) => {
                    const tags = {};
                    equipmentUtils.forEachMeasureProp(data, (options) => {
                        const tag = equipmentUtils.genMeasurePropTag(options);
                        tags[tag.id] = tag;
                    });
                    return tags;
                })
            );
    }

    getEquipValues(equipCode: string) {
        return this.http
            .get<any>(
                `${this.endPointConfig}${environment.monitorAPI}/monitor/equipment/multiple-data?equipmentCode=${equipCode}`
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
