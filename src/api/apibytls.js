import { post, get, put, del } from './api.js';
import baseUrl from './setBaseUrl'


export default {
    //查看手续费明细
    proceduresCompanyId:(params)=> get(baseUrl.api+'/procedures-calculate/procedures-companyId?companyId='+params),
    //查看佣金
    calculateAgentCode:(params)=> get(baseUrl.api+'/commission-calculate/commission-agentcode?agentCode='+params),


};
