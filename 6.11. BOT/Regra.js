'use strict';

const soapLib = require('soap');

const WSDL_ENDPOINT = 'http://ec2-3-85-78-134.compute-1.amazonaws.com:8080/g5-senior-services/rubi_Synccase_senior_gestao_estacionamento?wsdl';
const DEFAULT_RESPONSE_TYPE = 'PLAINTEXT';

function buildRequestPayload(params) {
    return {
        user: params.user ?? 'senior',
        password: params.password ?? 'senior',
        encryption: params.encryption ?? '0',
        parameters: {
            text: params.text ?? '',
            type: params.type ?? ''
        }
    };
}

function extractResponseData(soapResult) {
    if (!soapResult || !soapResult.length || !soapResult[0]) {
        return { responseText: 'Sem retorno da API', responseType: DEFAULT_RESPONSE_TYPE };
    }

    const data = soapResult[0];

    if (data.result) {
        return {
            responseText: data.result.text || 'Sem dados na base. Verifique!',
            responseType: data.result.type || DEFAULT_RESPONSE_TYPE
        };
    }

    if (data.text) {
        return {
            responseText: data.text,
            responseType: data.type || DEFAULT_RESPONSE_TYPE
        };
    }

    return { responseText: JSON.stringify(data), responseType: DEFAULT_RESPONSE_TYPE };
}

module.exports = async function handleBotRequest(authHeader, params) {
    try {
        const client = await soapLib.createClientAsync(WSDL_ENDPOINT);

        if (authHeader) {
            client.addHttpHeader('Authorization', authHeader);
        }

        const payload = buildRequestPayload(params);

        const soapResult = await client.BOTAsync(payload);
        const { responseText, responseType } = extractResponseData(soapResult);

        return { type: responseType, text: [responseText] };

    } catch (err) {
        console.error('Erro detalhado:', err);
        return { type: DEFAULT_RESPONSE_TYPE, text: [`Erro: ${err.message}`] };
    }
};
