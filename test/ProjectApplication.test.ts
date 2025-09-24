import { ProjectApplication } from '../src/application/ProjectApplicationService'; // o la ruta correcta
import { Project } from '../src/domain/Project';

describe('ProjectApplication', () => {
  let projectPortMock: any;
  let projectApp: ProjectApplication;

  beforeEach(() => {
    projectPortMock = {
      createProject: jest.fn(),
      getAllProjects: jest.fn(),
      getProjectById: jest.fn(),
      updateProject: jest.fn(),
      deleteProject: jest.fn(),
    };

    projectApp = new ProjectApplication(projectPortMock);
    jest.clearAllMocks();
  });

  describe('createProject', () => {
    it('debe crear un proyecto y retornar su ID', async () => {
      const newProject = {
        nombre: 'Nuevo Proyecto',
        descripcion: 'Proyecto de prueba',
        fecha_inicio: new Date(),
        fecha_fin: new Date(),
        status: 1,
        id_usuario: 1,
      };

      projectPortMock.createProject.mockResolvedValue(1);

      const result = await projectApp.createProject(newProject);

      expect(projectPortMock.createProject).toHaveBeenCalledWith(newProject);
      expect(result).toBe(1);
    });
  });

  describe('getAllProjects', () => {
    it('debe retornar una lista de proyectos', async () => {
      const projects: Project[] = [
        { id_proyecto: 1, nombre: 'P1', descripcion: 'test_1...', fecha_inicio: new Date(), fecha_fin: new Date(), estado: 1 },
        { id_proyecto: 2, nombre: 'P2', descripcion: 'test_2...', fecha_inicio: new Date(), fecha_fin: new Date(), estado: 1 },
      ];

      projectPortMock.getAllProjects.mockResolvedValue(projects);

      const result = await projectApp.getAllProjects();

      expect(projectPortMock.getAllProjects).toHaveBeenCalled();
      expect(result).toEqual(projects);
    });
  });

  describe('getProjectById', () => {
    it('debe retornar un proyecto por ID', async () => {
      const project: Project = {
        id_proyecto: 1,
        nombre: 'Proyecto',
        descripcion: 'desc',
        fecha_inicio: new Date(),
        fecha_fin: new Date(),
        estado: 1,
      };

      projectPortMock.getProjectById.mockResolvedValue(project);

      const result = await projectApp.getProjectById(1);

      expect(projectPortMock.getProjectById).toHaveBeenCalledWith(1);
      expect(result).toEqual(project);
    });

    it('debe retornar null si no existe el proyecto', async () => {
      projectPortMock.getProjectById.mockResolvedValue(null);

      const result = await projectApp.getProjectById(999);

      expect(result).toBeNull();
    });
  });

  describe('updateProject', () => {
    it('debe actualizar el proyecto si existe', async () => {
      const existing = { id_proyecto: 1, nombre: 'P1', descripcion: '', fecha_inicio: new Date(), fecha_fin: new Date(), status: 1, id_usuario: 1 };
      const updates = { nombre: 'Proyecto actualizado' };

      projectPortMock.getProjectById.mockResolvedValue(existing);
      projectPortMock.updateProject.mockResolvedValue(true);

      const result = await projectApp.updateProject(1, updates);

      expect(projectPortMock.getProjectById).toHaveBeenCalledWith(1);
      expect(projectPortMock.updateProject).toHaveBeenCalledWith(1, updates);
      expect(result).toBe(true);
    });

    it('debe lanzar error si el proyecto no existe', async () => {
      projectPortMock.getProjectById.mockResolvedValue(null);

      await expect(projectApp.updateProject(999, { nombre: 'No existe' }))
        .rejects.toThrow('El proyecto no existe');
    });
  });

  describe('deleteProject', () => {
    it('debe eliminar el proyecto si existe', async () => {
      const existing = { id_proyecto: 1, nombre: 'P1', descripcion: '', fecha_inicio: new Date(), fecha_fin: new Date(), status: 1, id_usuario: 1 };

      projectPortMock.getProjectById.mockResolvedValue(existing);
      projectPortMock.deleteProject.mockResolvedValue(true);

      const result = await projectApp.deleteProject(1);

      expect(projectPortMock.getProjectById).toHaveBeenCalledWith(1);
      expect(projectPortMock.deleteProject).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    it('debe lanzar error si el proyecto no existe', async () => {
      projectPortMock.getProjectById.mockResolvedValue(null);

      await expect(projectApp.deleteProject(999)).rejects.toThrow('Proyecto no encontrado');
    });
  });
});
