import type { Route } from "next";
import type { User } from "@supabase/supabase-js";
import type { UrlObject } from "url";

export type ID = number;
export type IsoDateTime = string;
export type Uuid = string;

export interface ReleaseItem { description: string; }

export interface Release {
    version: string;
    date: IsoDateTime;
    changelog: Array<ReleaseItem | string>;
}

export interface ProjectJson {
    id: ID;
    name: string;
    client?: string | null;
    release?: Release | null;
}

export interface Sprint {
    id: ID;
    start: IsoDateTime;
    end: IsoDateTime;
}

export type SprintRow = Sprint;

export interface ProjectRow {
    id: ID;
    name: string;
    client: string | null;
    project_start?: string | null;
    project_end?: string | null;
}

export interface SprintProjectRow {
    sprint_id: ID;
    project_id: ID;
    release: boolean;
    release_date: IsoDateTime | null;
    changelog_id: ID | null;
}

export interface ChangelogRow {
    id: ID;
    version: string;
    date: IsoDateTime;
    changelog: Array<ReleaseItem | string>;
}

export interface NavItem {
    href: Route;
    label: string;
    icon?: React.ReactNode;
    exact?: boolean;
};

export interface SprintSearchParams {
    sprintId?: string;
    q?: string;
    only?: "1" | "0";
};

export interface AuthState {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
    refresh: () => Promise<void>;
};

export interface LinkRow {
    sprint_id: ID;
    project_id: ID;
    release: boolean;
    release_date: IsoDateTime | null;
    changelog_id: ID | null;
};

export type LinkInfo = Pick<LinkRow, "release" | "release_date" | "changelog_id">;

export interface Card {
    project: {
        id: ID;
        name: string;
        client: string | null;
        release: null | {
            version: string;
            date: IsoDateTime;
            changelog: Array<ReleaseItem | string>;
        }
    };
    link: {
        release: boolean;
        release_date: IsoDateTime | null;
        changelog_id: ID | null
    };
};

export interface ChangelogModalProps {
    sprintId: ID;
    projectId: ID;
    changelogId?: ID | null;
    onClose: () => void;
    onSaved: (chg: ChangelogRow) => void;
}

export interface EmptyStateProps {
    title: string;
    subtitle?: string;
    ctaHref?: Route | UrlObject;
    ctaLabel?: string;
}

export interface ProjectCardProps {
    project: ProjectJson;
    sprintId: ID;
    link: LinkInfo;
}

export interface Props {
    modal: boolean;
    setModal: (open: boolean) => void;
};

export interface SignProps {
    email: string;
    password: string;
    setEmail: (v: string) => void;
    setPassword: (v: string) => void;
    emailError?: boolean;
    passError?: boolean;
}

export interface SprintHeaderProps {
    start: string;
    end: string;
    prevId?: number | null;
    nextId?: number | null;
    q?: string;
    only?: boolean;
    isCurrent?: boolean;
}

export interface SprintSearchProps {
    initialQuery?: string;
    initialOnly?: boolean;
}

export interface DeleteProjectModalProps { 
    projectId: ID; 
    projectName?: string | null; 
    onClose: () => void; 
    onDeleted: () => void; 
}

export interface ReleaseDateModalProps {
    initialDate: string | null;
    minDate?: string;
    maxDate?: string;
    onClose: () => void;
    onSave: (iso: string) => Promise<boolean>;
}

export interface ProjectCardProps {
    project: ProjectJson;
    sprintId: ID;
    link: LinkInfo;
    sprintStart: IsoDateTime;
    sprintEnd: IsoDateTime;
}

export interface UserRoleRow {
    user_id: Uuid;
    role_id: number;
    created_at?: IsoDateTime;
    email: string;
}

export type Role = 1 | 2 | 3;

export type UserWithRole = {
    user_id: string;
    email: string;
    role: Role;
};

export interface UsersTableProps {
    initial: UserWithRole[];
    canEdit: boolean;
}

export const ROLE_LABELS: Record<Role, string> = {
    1: "użytkownik",
    2: "edytujący",
    3: "admin",
};

export interface UserRoleProps {
    user_id: string;
    role: Role;
    email: string;
}

export interface SidebarProps {
    role: Role
}

export interface LayoutProps {
    children: React.ReactNode;
};

export interface SuspenseWrapperProps {
    children: React.ReactNode;
}