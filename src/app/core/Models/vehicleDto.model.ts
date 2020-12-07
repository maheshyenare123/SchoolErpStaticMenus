export class VehicleDtoModel {

    driverContact: string;
    driverLicence: string;
    driverName: string;
    id: number;
    isActive: string;
    manufactureYear: string;
    note: string;
    vehicleModel: string;
    vehicleNo: string;

    clear() {
        this.driverContact= '';
        this.driverLicence= '';
        this.driverName= '';
        this.id= 0;
        this.isActive= '';
        this.manufactureYear= '';
        this.note= '';
        this.vehicleModel= '';
        this.vehicleNo= '';
    }
}