export type User = {
    id: string
    fullname: string
    email: string
    password: string
    isAdmin: boolean
    preferences: UserPreferences
    createdAt: string
    updatedAt: string
    Member?: Member[]
    Institution?: Institution[]
};

export type UserPreferences = {
    notifications: boolean
    darkmode: boolean
    sound: boolean
};

export type Institution = {
    id: string
    ownerId: string
    name: string
    createdAt: string
    updatedAt: string
    User?: User
    Group?: Group[]
    _count?: {
        Member?: number
        Patient?: number
    };
};

export type Member = {
    id: string
    userId: string
    institutionId: string
    authorizations: number
    invitation: Status
    acceptedAt: string | null
    createdAt: string
    updatedAt: string
    Institution?: Institution
    User?: User
    GroupMember?: GroupMember[]
};

export type Group = {
    id: string
    name: string
    description: string
    institutionId: string
    createdAt: string
    updatedAt: string
    Patient?: Patient[]
    _count?: {
        Patient?: number
        GroupMember?: number
    }
};

export type GroupMember = {
    id: string
    memberId: string
    groupId: string
    authorizations: number
    Member?: Member
};

export type Insights = {
    tags: Array<{ token: string; category: 'Problema' | 'Teste' | 'Ocorrencia' | 'DepartamentoClinico' | 'Tratamento' }>
    highlightedTranscription: Array<{ token: string; category: string }>
    structuredData: {
        clinicaldepartments: Array<string>
        occurances: Array<string>
        problems: Array<string>
        tests: Array<string>
        treatments: Array<string>
    }
    status?: number
};

export type Patient = {
    id: string
    fullname: string
    birthDate: string | null
    height: number | null
    weight: number | null
    groupId: string | null
    institutionId: string
    createdAt: string
    updatedAt: string
    Summarization?: Summarization[]
};

export type Summarization = {
    id: string
    patientId: string
    title: string
    transcription: string
    audioPath: string | null
    insights: Insights
    status: SummarizationStatus
    createdAt: string
    updatedAt: string
};

export const Status = {
    PENDING: 'PENDING',
    REJECTED: 'REJECTED',
    ACCEPTED: 'ACCEPTED'
};

export type Status = (typeof Status)[keyof typeof Status]

export const SummarizationStatus = {
    PROCESSING: 'PROCESSING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED'
};

export type SummarizationStatus = (typeof SummarizationStatus)[keyof typeof SummarizationStatus]