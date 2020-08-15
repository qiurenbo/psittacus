import Psittacus from "psittacus";

describe("state should transfer properly", () => {
  it("recording should be transferred from recording to stopped", () => {
    let psittacus = new Psittacus();
    expect(psittacus.getState()).toEqual("stopped");
    psittacus.record();

    expect(psittacus.getState()).toEqual("recording");

    psittacus.stop();

    expect(psittacus.getState()).toEqual("stopped");
  });

  it("playing should be transferred from playing to stopped", () => {
    let psittacus = new Psittacus();
    expect(psittacus.getState()).toEqual("stopped");
    psittacus.record();
    expect(psittacus.getState()).toEqual("recording");
    psittacus.stop();
    expect(psittacus.getState()).toEqual("stopped");
    psittacus.play();
    expect(psittacus.getState()).toEqual("stopped");
  });
});

describe("export wav should work", () => {
  it("wav header should be 44 bytes", (done) => {
    let config = {
      method: "AudioContext",
      bufferSize: 4096,
      sampleRate: 16000,
      bitDepth: 16,
    };

    let psittacus = new Psittacus(config);

    psittacus.record();

    psittacus.stop();

    psittacus.export("wav", (blob) => {
      expect(blob.size).toEqual(44);
      done();
    });
  });

  it("sample rate configuration should work", (done) => {
    let config = {
      method: "AudioContext",
      bufferSize: 4096,
      sampleRate: 16000,
      bitDepth: 16,
    };

    let psittacus = new Psittacus(config);

    psittacus.record();

    psittacus.stop();

    psittacus.export("wav", async (blob) => {
      const buffer = await blob.arrayBuffer();
      const view = new DataView(buffer);
      expect(view.getUint32(24, true)).toEqual(16000);
      done();
    });

    config.sampleRate = 8000;

    psittacus = new Psittacus(config);

    psittacus.record();

    psittacus.stop();

    psittacus.export("wav", async (blob) => {
      const buffer = await blob.arrayBuffer();
      const view = new DataView(buffer);
      expect(view.getUint32(24, true)).toEqual(8000);
      done();
    });
  });

  it("bitDepth configuration should work", (done) => {
    let config = {
      method: "AudioContext",
      bufferSize: 4096,
      sampleRate: 16000,
      bitDepth: 16,
    };

    let psittacus = new Psittacus(config);

    psittacus.record();

    psittacus.stop();

    psittacus.export("wav", async (blob) => {
      const buffer = await blob.arrayBuffer();
      const view = new DataView(buffer);
      expect(view.getUint16(34, true)).toEqual(16);
      done();
    });

    config.bitDepth = 8;

    psittacus = new Psittacus(config);

    psittacus.record();

    psittacus.stop();

    psittacus.export("wav", async (blob) => {
      const buffer = await blob.arrayBuffer();
      const view = new DataView(buffer);
      expect(view.getUint16(34, true)).toEqual(8);
      done();
    });
  });
});
