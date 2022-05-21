export interface ServerLibrary {
  id: string;
  name: string;
  isPublic: boolean;
  labId: string;
}

export interface ServerLibraryVersion {
  id: string;
  createdAt: string;
  version: string;
  dataModel: string;
  libraryId: string;
  isPublished: boolean;
  library: ServerLibrary;
}
