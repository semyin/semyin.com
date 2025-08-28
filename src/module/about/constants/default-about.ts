import { format } from 'date-fns';
import { ContactMethod, BlogJourneyItem } from '../dto/about.dto';

export const DEFAULT_ABOUT_DATA = {
  title: '关于',
  content: '这里是关于页面的内容，请编辑修改。',
  summary: '关于页面',
  authorId: 1,
  isPublished: false,
  contactMethods: [
    {
      type: 'email',
      label: '邮箱',
      value: 'your-email@example.com',
      icon: 'email'
    }
  ] as ContactMethod[],
  blogJourney: [
    {
      date: format(new Date(), 'yyyy-MM-dd'),
      title: '博客创建',
      description: '开始了我的博客之旅',
      milestone: true
    }
  ] as BlogJourneyItem[]
};