# Case Senior - Gestão de Estacionamento

Repositório para subir os artefatos desenvolvidos no case de desenvolvimento Senior. Este projeto contempla a integração entre o **Senior XT (G5)** e a **Plataforma Senior X (G7)** para a gestão eficiente de vagas de estacionamento.

---

## 📂 Estrutura do Projeto

Abaixo estão os links para cada componente da solução, organizados conforme a estrutura de pastas do repositório:

| Item | Artefato | Descrição |
| :--- | :--- | :--- |
| 📁 | [6.01 & 6.02. Telas + Tabelas](#601--602-telas--tabelas) | Estrutura de dados e interfaces de cadastro na XT. |
| 📁 | [6.03. Relatórios - XT](#603-relatórios---xt) | Modelos de Termo de Responsabilidade e Exportação CSV. |
| 📁 | [6.04. Importador - XT](#604-importador---xt) | Rotina para cadastro de veículos em lote. |
| 📁 | [6.05. Regra - XT](#605-regra---xt) | Automação para envio de e-mail de status diário. |
| 📁 | [6.06. Webservice - XT](#606-webservice---xt) | Serviços de integração para comunicação com o BPM. |
| 📁 | [6.07. Menus - XT](#607-menus---xt) | Configuração do menu personalizado na G5. |
| 📁 | [6.08. BPM - PLATFORM X](#608-bpm---platform-x) | Fluxo de solicitação de vagas com assinatura digital. |
| 📁 | [6.09. VISÃO DINÂMICA - PLATFORM X](#609-visão-dinâmica---platform-x) | Consultas dinâmicas de cadastros e solicitações. |
| 📁 | [6.10. ANALYTICS - PLATFORM X](#610-analytics---platform-x) | Painéis gerenciais e indicadores de ocupação. |
| 📁 | [6.11. BOT](#611-bot) | Assistente virtual para consulta de vagas disponíveis. |
| 📁 | [6.12. Tela Web Platform X - tela-web@v1.0](#612-tela-web-platform-x---tela-webv10) | Interface interativa em Angular/PrimeNG. |
| 📁 | [6.13. BPM (INTERFACE WEB) - PLATFORM X](#613-bpm-interface-web---platform-x) | Fluxo web para cadastro de veículos. |
| 📁 | [6.14. MENU - PLATFORM X](#614-menu---platform-x) | Parametrização de menus na Plataforma X. |
| 📁 | [6.15. GIT](#615-git) | Documentação de versionamento e repositório. |
| 📁 | [6.16. MANUAL DE USUÁRIO](#616-manual-de-usuário) | Guias de utilização para colaboradores e gestores. |

---

## 🛠️ Detalhes das Configurações

### 6.01. & 6.02. Telas + Tabelas
- **Tabelas:** Criação das tabelas `USU_T120EST` (Estacionamento), `USU_T120VEI` (Veículos) e a tabela de vagas com ligação N:N, `USU_T120VAG`.
- **Telas:** Telas SGI para manutenção de dados com validações de campos obrigatórios e bloqueio de edição após inserção.

### 6.03. Relatórios - XT
- **Termo de Responsabilidade:** Relatório em PDF com texto jurídico dinâmico para assinatura.
- **Relatório de Vagas:** Exportação em formato `.csv` para conferência de ocupação.

### 6.04. Importador - XT
- **Modelo 701:** Importação via arquivo CSV com delimitador `;`. Permite o cadastro massivo de veículos vinculados aos colaboradores.

### 6.05. Regra - XT
- **Processo Automático:** Regra `001` vinculada a um processo agendado para envio de e-mail diário com o resumo de vagas ocupadas e disponíveis.

### 6.06. Webservice - XT
- **Integração:** Disponibilização de serviços SOAP/REST para que o BPM da Plataforma X possa realizar operações de CRUD nas tabelas da G5.

### 6.08. BPM - PLATFORM X
- **Fluxo ECM:** Gerenciamento da solicitação de vaga, integrando com o GED para armazenamento do termo e Senior SIGN para assinatura eletrônica.
- **Fluxo WEB:** Solicitações de cadastros de veículos. Desenvolvido em Angular utilizando o framework **PrimeNG**.

### 6.12. Tela Web Platform X
- **Tela Web** Dashboard interativo com status das vagas e ações administrativas para o gestor. Desenvolvido em Angular utilizando o framework **PrimeNG**.

---

## 🚀 Como Instalar
6.01. & 6.02. Utilize o arquivo `vetor.tbs` para visualizar e copiar a estrutura das tabelas. Importe as interfaces e formulários através do SGI.

6.03. Os arquivos dos relatórios devem ser movidos para a pasta vetorh/Modelos, na raiz da instalação do XT.

6.04. O arquivo do importador deve ser movido para a pasta vetorh/ImpExp, na raiz da instalação do XT.

6.05. O arquivo da regra deve ser movido para a pasta vetorh/Regras, na raiz da instalação do XT.

6.06. Os webservices podem ser importados através do Editor de Webservices.

6.08. Importe os arquivos `.zip` na plataforma e execute o projeto e execute o comando `npm run start`.

6.12. Configure o menu/tela na plataforma apontando para a URL https://localhost:4200/ e e execute o comando `npm run start`.

---
**Desenvolvido por:** Nathanael Felipe
**Status:** Versão 1.0
