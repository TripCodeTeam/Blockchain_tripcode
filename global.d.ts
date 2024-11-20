// global.d.ts
declare var artifacts: any;

declare namespace Truffle {
  export interface Deployer {
    deploy: (contract: any) => Promise<void>;
  }
}