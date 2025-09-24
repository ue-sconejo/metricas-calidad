import { MetricsApplicationService } from "../src/application/MetricsApplicationService";
import { Metrics } from "../src/domain/Metrics";
import { MetricsPort } from "../src/domain/MetricsPort";

describe("MetricsApplicationService", () => {
  let service: MetricsApplicationService;
  let mockPort: jest.Mocked<MetricsPort>;

  beforeEach(() => {
    mockPort = {
      createMetrics: jest.fn(),
      getMetricsById: jest.fn(),
      updateMetrics: jest.fn(),
      deleteMetrics: jest.fn(),
      getAllMetrics: jest.fn(),
      getMetricsByUserId: jest.fn(),
    };
    service = new MetricsApplicationService(mockPort);
  });

  describe("createMetrics", () => {
    it("debería llamar a createMetrics del puerto y devolver el id de la nueva métrica", async () => {
      mockPort.createMetrics.mockResolvedValue(42);
      const metricData: Omit<Metrics, "id_metrica"> = { /* propiedades sin id_metrica */ } as any;

      const result = await service.createMetrics(metricData);

      expect(mockPort.createMetrics).toHaveBeenCalledWith(metricData);
      expect(result).toBe(42);
    });
  });

  describe("updateMetrics", () => {
    it("debería actualizar una métrica existente y devolver true", async () => {
      mockPort.getMetricsById.mockResolvedValue({ id_metrica: 1 } as Metrics);
      mockPort.updateMetrics.mockResolvedValue(true);

      const result = await service.updateMetrics(1, { someField: "value" });

      expect(mockPort.getMetricsById).toHaveBeenCalledWith(1);
      expect(mockPort.updateMetrics).toHaveBeenCalledWith(1, { someField: "value" });
      expect(result).toBe(true);
    });

    it("debería lanzar un error si la métrica no existe", async () => {
      mockPort.getMetricsById.mockResolvedValue(null);

      await expect(service.updateMetrics(1, {})).rejects.toThrow("No se encontró la métrica");
      expect(mockPort.updateMetrics).not.toHaveBeenCalled();
    });
  });

  describe("deleteMetrics", () => {
    it("debería eliminar una métrica existente y devolver true", async () => {
      mockPort.getMetricsById.mockResolvedValue({ id_metrica: 1 } as Metrics);
      mockPort.deleteMetrics.mockResolvedValue(true);

      const result = await service.deleteMetrics(1);

      expect(mockPort.getMetricsById).toHaveBeenCalledWith(1);
      expect(mockPort.deleteMetrics).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    it("debería lanzar un error si la métrica no existe", async () => {
      mockPort.getMetricsById.mockResolvedValue(null);

      await expect(service.deleteMetrics(1)).rejects.toThrow("No se encontró la métrica");
      expect(mockPort.deleteMetrics).not.toHaveBeenCalled();
    });
  });

  describe("getAllMetrics", () => {
    it("debería devolver todas las métricas", async () => {
      const metricsList = [{ id_metrica: 1 }, { id_metrica: 2 }] as Metrics[];
      mockPort.getAllMetrics.mockResolvedValue(metricsList);

      const result = await service.getAllMetrics();

      expect(mockPort.getAllMetrics).toHaveBeenCalled();
      expect(result).toEqual(metricsList);
    });
  });

  describe("getMetricsById", () => {
    it("debería devolver una métrica por su id", async () => {
      const metric = { id_metrica: 1 } as Metrics;
      mockPort.getMetricsById.mockResolvedValue(metric);

      const result = await service.getMetricsById(1);

      expect(mockPort.getMetricsById).toHaveBeenCalledWith(1);
      expect(result).toEqual(metric);
    });
  });

  describe("getMetricsByUserId", () => {
    it("debería devolver las métricas asociadas a un usuario", async () => {
      const userMetrics = [{ id_metrica: 1 }, { id_metrica: 3 }] as Metrics[];
      mockPort.getMetricsByUserId.mockResolvedValue(userMetrics);

      const result = await service.getMetricsByUserId(10);

      expect(mockPort.getMetricsByUserId).toHaveBeenCalledWith(10);
      expect(result).toEqual(userMetrics);
    });
  });
});
