// export interface Template {
//     id: string;
//     name: string;
//     price: number;
//     previewImage: string;
//     description: string;
//     templatePath: string;
//   }
  
  export interface Purchase {
    id: string;
    templateId: string;
    userId: string;
    status: 'pending' | 'paid';
    assignedDomain?: string;
    createdAt: Date;
  }




  export type Website = {
    id: number
    name?: string
  }
  
  export type WebsiteDetails = {
    business_name?: string;
    business_email?: string;
    phone?: string;
    address_line_1?: string;
    address_line_2?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
  
    logo?: string;
    favicon?: string;
  
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
  
    footer_text?: string;
    copyright_text?: string;
  
    custom_domain?: string;
    a_record?: string;
    cname_record?: string;
    dns_verified?: boolean;
    verification_checked_at?: string | null;
    dns_records?: string;
    hosting_provider?: string;
  
    deployed_url?: string;
    is_deployed?: boolean;
  };
  
  type Props = {
    website: Website
    details: WebsiteDetails
  }


  export interface PageProps {
    auth: { user?: any }; // required by Inertia in your setup
    flash?: { message?: string };
    [key: string]: any;
  }

  import { PageProps as InertiaPageProps } from "@inertiajs/core";

export type Review = {
  user_name: string;
  rating: number;
  comment: string;
};

export type Template = {
  id: number;
  name: string;
  short_description?: string;
  description?: string;
  main_screenshot?: string;
  screenshots?: string[];
  reviews?: Review[];
  data?: any;
};

export type TemplatePageProps = InertiaPageProps & {
  website?: any;
  templateId: number;
  template: Template;
};


export type SectionType =
  | "navbar"
  | "footer"
  | "hero"
  | "about"
  | "contact";

export type SectionProps = {
  content: any;
  editing?: boolean;
  updateContent?: (data: any) => void;
  sectionId?: string;
  website?: any;
};