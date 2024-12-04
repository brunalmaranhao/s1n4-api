import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { PbiAuthService } from './auth'

export type ReportDetailsProps = {
  reportId: string
  reportName: string
  embedUrl: string
}
export type ReportDetailsResponse = {
  accessToken?: { token: string; expiration: string }
  embedUrl?: ReportDetailsProps[]
  expiry?: string
  isError: boolean
  name?: string
  id?: string
}

type EmbedConfigProps = {
  type?: string
  reportsDetail: ReportDetailsProps[]
  embedToken: { token: string; expiration: string }
}

@Injectable()
export class PbiEmbedService {
  constructor(private pbiAuthService: PbiAuthService) {}

  async getEmbedInfo(
    workspaceId: string,
    reportId: string,
  ): Promise<ReportDetailsResponse | undefined> {
    try {
      // console.log('PpbiReportId: ' + reportId)
      // console.log('PpbiWorkspaceId: ' + workspaceId)
      const embedParams = await this.getEmbedParamsForSingleReport(
        workspaceId,
        reportId,
      )

      return {
        accessToken: embedParams.embedToken,
        embedUrl: embedParams.reportsDetail,
        expiry: embedParams.embedToken.expiration,
        isError: false,
      }
    } catch (err) {
      // console.log(err)
      // console.log(err)
    }
  }

  async getEmbedParamsForSingleReport(
    workspaceId: string,
    reportId: string,
    additionalDatasetId?: string,
  ) {
    const reportInGroupApi = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}`
    const headers = await this.pbiAuthService.getRequestHeader('analysis')
    if (headers.isLeft()) {
      const error = headers.value

      switch (error.constructor) {
        case UnauthorizedException:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
    const { header } = headers.value
    const result = await fetch(reportInGroupApi, {
      method: 'GET',
      headers: header,
    })

    if (!result.ok) {
      throw result
    }

    const resultJson = await result.json()

    const reportDetails: ReportDetailsProps = {
      reportId: resultJson.id,
      reportName: resultJson.name,
      embedUrl: resultJson.embedUrl,
    }

    const datasetIds = [resultJson.datasetId]

    if (additionalDatasetId) {
      datasetIds.push(additionalDatasetId)
    }
    const embedToken = await this.getEmbedTokenForSingleReportSingleWorkspace(
      reportId,
      datasetIds,
      workspaceId,
    )
    const reportEmbedConfig: EmbedConfigProps = {
      reportsDetail: [reportDetails],
      embedToken,
    }

    return reportEmbedConfig
  }

  async getEmbedTokenForSingleReportSingleWorkspace(
    reportId: string,
    datasetIds: string[],
    targetWorkspaceId: string,
  ) {
    const datasets: { id: string }[] = []
    const targetWorkspaces: { id: string }[] = []
    for (const datasetId of datasetIds) {
      datasets.push({
        id: datasetId,
      })
    }

    const formData = {
      reports: [
        {
          id: reportId,
        },
      ],
      datasets,
      targetWorkspaces,
    }

    if (targetWorkspaceId) {
      formData.targetWorkspaces = []
      formData.targetWorkspaces.push({
        id: targetWorkspaceId,
      })
    }

    const embedTokenApi = 'https://api.powerbi.com/v1.0/myorg/GenerateToken'
    const headers = await this.pbiAuthService.getRequestHeader('analysis')
    if (headers.isLeft()) {
      const error = headers.value

      switch (error.constructor) {
        case UnauthorizedException:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
    const { header } = headers.value

    const result = await fetch(embedTokenApi, {
      method: 'POST',
      headers: header,
      body: JSON.stringify(formData),
    })

    if (!result.ok) throw result
    return result.json()
  }

  // async getEmbedTokenForMultipleReportsSingleWorkspace(
  //   reportIds,
  //   datasetIds,
  //   targetWorkspaceId
  // ) {
  //   // Add dataset ids in the request
  //   let formData = { datasets: [] };
  //   for (const datasetId of datasetIds) {
  //     formData["datasets"].push({
  //       id: datasetId,
  //     });
  //   }

  //   // Add report ids in the request
  //   formData["reports"] = [];
  //   for (const reportId of reportIds) {
  //     formData["reports"].push({
  //       id: reportId,
  //     });
  //   }

  //   // Add targetWorkspace id in the request
  //   if (targetWorkspaceId) {
  //     formData["targetWorkspaces"] = [];
  //     formData["targetWorkspaces"].push({
  //       id: targetWorkspaceId,
  //     });
  //   }

  //   const embedTokenApi = "https://api.powerbi.com/v1.0/myorg/GenerateToken";
  //   const headers = await this.pbiAuthService.getRequestHeader();

  //   // Generate Embed token for multiple datasets, reports and single workspace. Refer https://aka.ms/MultiResourceEmbedToken
  //   const result = await fetch(embedTokenApi, {
  //     method: "POST",
  //     headers: headers,
  //     body: JSON.stringify(formData),
  //   });

  //   if (!result.ok) throw result;
  //   return result.json();
  // }

  // async function getEmbedParamsForMultipleReports(
  //   workspaceId,
  //   reportIds,
  //   additionalDatasetIds
  // ) {
  //   // EmbedConfig object
  //   const reportEmbedConfig = new EmbedConfig();

  //   // Create array of embedReports for mapping
  //   reportEmbedConfig.reportsDetail = [];

  //   // Create Array of datasets
  //   let datasetIds = [];

  //   // Get datasets and Embed URLs for all the reports
  //   for (const reportId of reportIds) {
  //     const reportInGroupApi = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}`;
  //     const headers = await getRequestHeader();

  //     // Get report info by calling the PowerBI REST API
  //     const result = await fetch(reportInGroupApi, {
  //       method: "GET",
  //       headers: headers,
  //     });

  //     if (!result.ok) {
  //       throw result;
  //     }

  //     // Convert result in json to retrieve values
  //     const resultJson = await result.json();

  //     // Store result into PowerBiReportDetails object
  //     const reportDetails = new PowerBiReportDetails(
  //       resultJson.id,
  //       resultJson.name,
  //       resultJson.embedUrl
  //     );

  //     // Create mapping for reports and Embed URLs
  //     reportEmbedConfig.reportsDetail.push(reportDetails);

  //     // Push datasetId of the report into datasetIds array
  //     datasetIds.push(resultJson.datasetId);
  //   }

  //   // Append to existing list of datasets to achieve dynamic binding later
  //   if (additionalDatasetIds) {
  //     datasetIds.push(...additionalDatasetIds);
  //   }

  //   // Get Embed token multiple resources
  //   reportEmbedConfig.embedToken =
  //     await getEmbedTokenForMultipleReportsSingleWorkspace(
  //       reportIds,
  //       datasetIds,
  //       workspaceId
  //     );
  //   return reportEmbedConfig;
  // }
}
