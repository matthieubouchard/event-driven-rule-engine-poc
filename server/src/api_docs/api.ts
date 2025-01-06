/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export enum RuleConditionFact {
  FamilyStatus = 'familyStatus',
  IsBusinessOwner = 'isBusinessOwner',
  FiledUsTaxes2021 = 'filedUsTaxes2021',
}

export enum FamilyStatusEnum {
  NEW = 'NEW',
  RETURNING = 'RETURNING',
}

export interface FamilyStatusCondition {
  fact: RuleConditionFact
  value: FamilyStatusEnum
}

export interface BusinessOwnerCondition {
  fact: RuleConditionFact
  value: boolean
}

export interface Filed2021Condition {
  fact: RuleConditionFact
  value: boolean
}

export interface Action {
  /** @default "DOCUMENT_REQUEST" */
  type: 'DOCUMENT_REQUEST'
  value: string
  description?: string
}

export interface CreateRuleDto {
  name: string
  description: string
  /** @default "APPLICATION" */
  type: 'APPLICATION' | 'PAYMENT' | 'NOTIFICATION'
  conditions: (FamilyStatusCondition | BusinessOwnerCondition | Filed2021Condition)[]
  actions: Action[]
}

export interface RuleVersionDto {
  id: string
  version: number
  name: string
  description: string
  type: 'APPLICATION' | 'PAYMENT' | 'NOTIFICATION'
  ruleJson?: {
    conditions: (FamilyStatusCondition | BusinessOwnerCondition | Filed2021Condition)[]
    actions: Action[]
  }
}

export interface RuleDto {
  id: string
  active?: boolean
  versions: RuleVersionDto[]
}

export interface RuleConditionsInput {
  conditions: any[][]
}

export interface StudentDto {
  firstName: string
  lastName: string
  /** @format date-time */
  dob: string
}

export interface SchoolDto {
  name: string
}

export interface RuleVersionName {
  version: number
  name: string
}

export interface RuleAuditDto {
  ruleVersion: RuleVersionName
  matched: boolean
  id: string
  /** @format date-time */
  evaluatedAt: string
}

export interface DocumentDto {
  name: string
}

export interface DocumentRequestDto {
  id: string
  /** @format date-time */
  requestedAt: string
  /** @format date-time */
  updatedAt: string
  status: 'PENDING' | 'REQUESTED' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'
  document: DocumentDto
}

export interface ApplicationResponseDto {
  familyStatus: 'NEW' | 'RETURNING'
  id: string
  isBusinessOwner: boolean
  filedUsTaxes2021: boolean
  student: StudentDto
  school: SchoolDto
  ruleAudits: RuleAuditDto[]
  documentRequests: DocumentRequestDto[]
}

export interface GenericMutationResponse {
  message: string
  success: boolean
}

export type QueryParamsType = Record<string | number, any>
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean
  /** request path */
  path: string
  /** content type of request body */
  type?: ContentType
  /** query params */
  query?: QueryParamsType
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat
  /** request body */
  body?: unknown
  /** base url */
  baseUrl?: string
  /** request cancellation token */
  cancelToken?: CancelToken
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void
  customFetch?: typeof fetch
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D
  error: E
}

type CancelToken = Symbol | string | number

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = ''
  private securityData: SecurityDataType | null = null
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker']
  private abortControllers = new Map<CancelToken, AbortController>()
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams)

  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  }

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig)
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data
  }

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key)
    return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key])
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key]
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&')
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {}
    const keys = Object.keys(query).filter((key) => 'undefined' !== typeof query[key])
    return keys.map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key))).join('&')
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery)
    return queryString ? `?${queryString}` : ''
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) => (input !== null && (typeof input === 'object' || typeof input === 'string') ? JSON.stringify(input) : input),
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== 'string' ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key]
        formData.append(
          key,
          property instanceof Blob ? property : typeof property === 'object' && property !== null ? JSON.stringify(property) : `${property}`,
        )
        return formData
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  }

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    }
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken)
      if (abortController) {
        return abortController.signal
      }
      return void 0
    }

    const abortController = new AbortController()
    this.abortControllers.set(cancelToken, abortController)
    return abortController.signal
  }

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken)

    if (abortController) {
      abortController.abort()
      this.abortControllers.delete(cancelToken)
    }
  }

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) && this.securityWorker && (await this.securityWorker(this.securityData))) ||
      {}
    const requestParams = this.mergeRequestParams(params, secureParams)
    const queryString = query && this.toQueryString(query)
    const payloadFormatter = this.contentFormatters[type || ContentType.Json]
    const responseFormat = format || requestParams.format

    return this.customFetch(`${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>
      r.data = null as unknown as T
      r.error = null as unknown as E

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data
              } else {
                r.error = data
              }
              return r
            })
            .catch((e) => {
              r.error = e
              return r
            })

      if (cancelToken) {
        this.abortControllers.delete(cancelToken)
      }

      if (!response.ok) throw data
      return data
    })
  }
}

/**
 * @title Rules Engine API
 * @version 1.0
 * @contact
 *
 * API documentation for the Rules Engine
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Create version 0 of your first rule
     *
     * @tags Rule
     * @name RuleControllerCreateRule
     * @summary Create a new rule
     * @request POST:/api/rules
     */
    ruleControllerCreateRule: (data: CreateRuleDto, params: RequestParams = {}) =>
      this.request<
        {
          id?: string
        },
        any
      >({
        path: `/api/rules`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description An array of rules with the latest version
     *
     * @tags Rule
     * @name RuleControllerFindAll
     * @summary Get all rules
     * @request GET:/api/rules
     */
    ruleControllerFindAll: (params: RequestParams = {}) =>
      this.request<RuleDto[], any>({
        path: `/api/rules`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description Will create a new ruleVersion
     *
     * @tags Rule
     * @name RuleControllerUpdateRule
     * @summary Update a rule by id
     * @request PUT:/api/rules/{id}
     */
    ruleControllerUpdateRule: (id: string, data: CreateRuleDto, params: RequestParams = {}) =>
      this.request<
        {
          id?: string
        },
        any
      >({
        path: `/api/rules/${id}`,
        method: 'PUT',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Rule
     * @name RuleControllerFindOne
     * @request GET:/api/rules/{id}
     */
    ruleControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<RuleDto, any>({
        path: `/api/rules/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Rule
     * @name RuleControllerSoftDelete
     * @request DELETE:/api/rules/{id}
     */
    ruleControllerSoftDelete: (id: string, params: RequestParams = {}) =>
      this.request<
        {
          id?: string
        },
        any
      >({
        path: `/api/rules/${id}`,
        method: 'DELETE',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags RuleEvaluation
     * @name RuleEvaluationControllerGetMatchingApplicationsCount
     * @summary Get count of applications matching rule conditions
     * @request POST:/api/preview-count
     */
    ruleEvaluationControllerGetMatchingApplicationsCount: (data: RuleConditionsInput, params: RequestParams = {}) =>
      this.request<
        {
          count?: number
        },
        any
      >({
        path: `/api/preview-count`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Document
     * @name DocumentControllerFindAll
     * @request GET:/api/document
     */
    documentControllerFindAll: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/document`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Notification
     * @name NotificationControllerConnect
     * @request GET:/api/notification/sse
     */
    notificationControllerConnect: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/notification/sse`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Application
     * @name ApplicationControllerFindAll
     * @summary Get all applications with rule audit logs and document requests
     * @request GET:/api/application
     */
    applicationControllerFindAll: (params: RequestParams = {}) =>
      this.request<any, ApplicationResponseDto[]>({
        path: `/api/application`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Application
     * @name ApplicationControllerProcessApplication
     * @summary Kick off the sequence of events to process an application -> evaluate rule for application and create document request is applicable
     * @request POST:/api/application/process/{id}
     */
    applicationControllerProcessApplication: (id: string, params: RequestParams = {}) =>
      this.request<any, GenericMutationResponse>({
        path: `/api/application/process/${id}`,
        method: 'POST',
        ...params,
      }),
  }
}
