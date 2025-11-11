// export interface AppointmentCreateDTO {
//   serviceCenterId: number;
//   /** User ID */
//   customerId: number;
//   vehicleId: number;
//   appointmentDate: string;
// }


export interface CuisineCreateDTO {
    name: string;
    description?: string;
}

export interface CuisineUpdateDTO {
    name: string;
    description?: string | null;
}


