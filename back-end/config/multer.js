// Este código configura o multer para lidar com o upload de arquivos, especificamente imagens. Aqui está o que está acontecendo:

// O multer é configurado com opções para armazenar arquivos em disco (diskStorage) e filtrar os arquivos por extensão (fileFilter).
// A configuração diskStorage define o diretório onde os arquivos serão armazenados e define o nome dos arquivos com um timestamp para torná-los únicos.
// A função fileFilter filtra os arquivos aceitos para upload, verificando se a extensão do arquivo está entre os formatos de imagem aceitos.
// Se a extensão do arquivo é válida, o middleware chama o callback com true, permitindo o upload. Caso contrário, chama o callback com false, recusando o upload.
// O módulo multer configurado é exportado para ser utilizado em outras partes do aplicativo que precisem lidar com uploads de imagens.

const multer = require("multer"); // Importa o módulo multer para lidar com upload de arquivos
const path = require("path"); // Importa o módulo path para lidar com caminhos de arquivos

module.exports = (multer({

  // Configuração de armazenamento do multer
  storage: multer.diskStorage({
      // Define o diretório onde os arquivos serão armazenados
      destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, "..", "tmp", "uploads")); // Caminho absoluto para a pasta de uploads
      },

      // Define o nome do arquivo
      filename: (req, file, cb) => {
          cb(null, Date.now().toString() + path.extname(file.originalname)); // Adiciona um timestamp ao nome do arquivo para torná-lo único
      }
  }),

  // Filtra os arquivos aceitos para upload
  fileFilter: (req, file, cb) => {

      // Verifica se a extensão do arquivo está entre os formatos aceitos
      const extesaoImg = ['image/png', 'image/jpg', 'image/jpeg'].find(formatoAceito => formatoAceito == file.mimetype);

      // Retorna TRUE se a extensão do arquivo é válida
      if(extesaoImg){
          return cb(null, true);
      }

      // Retorna FALSE se a extensão do arquivo não é válida
      return cb(null, false);
  }
}));

