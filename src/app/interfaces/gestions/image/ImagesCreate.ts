export interface ImagesCreate{
    id: number;
    libelle: string;
    photo?: string; 
    nomFichier?: string;
    typeMime?: string;
    appartementId?: number; 
    vehiculeId?: number;
    previewUrl?: string;
}

export interface ImageUploadRequest{
    libelle?: string;
    file?: File;
}

export interface ImageUploadResponse {
    message: string;
    id?: number;
}