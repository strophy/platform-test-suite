const createClientWithoutWallet = require('../../../lib/test/createClientWithoutWallet');

describe('Core', () => {
  describe('getBlockHash', () => {
    let client;
    let lastBlockHeight;

    before(async () => {
      client = createClientWithoutWallet();

      ({ blocks: lastBlockHeight } = await client.getDAPIClient().core.getStatus());
    });

    after(async () => {
      if (client) {
        await client.disconnect();
      }
    });

    it('should get block hash by height', async () => {
      const height = lastBlockHeight - 10;
      const hash = await client.getDAPIClient().core.getBlockHash(height);

      expect(hash).to.be.a('string');
    });

    it('should return RPC error if hash not found', async () => {
      const height = lastBlockHeight * 2;

      let broadcastError;

      try {
        await client.getDAPIClient().core.getBlockHash(height);
      } catch (e) {
        broadcastError = e;
      }

      expect(broadcastError).to.exist();
      expect(broadcastError.name).to.equal('JsonRpcError');
      expect(broadcastError.message).contains('Block height out of range');
    });
  });
});
