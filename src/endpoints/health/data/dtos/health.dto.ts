export type HealthJson = {
  status: string;
  version: string;
  timestamp: Date;
  uptimeSeconds: number;
  nodeVersion: string;
  dependencies?: PackagedDependency[];
  databases: DatabaseHealthJson[];
  [key: string]: unknown;
};

export type PackagedDependency = {
  name: string;
  version: string;
};

export type DatabaseHealthJson = {
  name: string;
  status: string;
};
