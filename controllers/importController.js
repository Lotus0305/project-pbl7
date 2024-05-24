const importService = require("../services/importService");

const importController = {
  importAccount: async (req, res) => {
    try {
      const importedCount = await importService.importAccount();
      res.status(200).send(`Accounts imported successfully: ${importedCount}`);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  importNovel: async (req, res) => {
    try {
      const importedCount = await importService.importNovel();
      res.status(200).send(`Novels imported successfully: ${importedCount}`);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  importComment: async (req, res) => {
    try {
      const importedCount = await importService.importComment();
      res.status(200).send(`Comments imported successfully: ${importedCount}`);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = importController;
