import { useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/common/Chip';

export function JobsError() {
  const router = useRouter();
  const boundary = useQueryErrorResetBoundary();
  useEffect(() => { toast.error('We couldn’t load the leads. Please try again.'); }, []);
  return <EmptyState title="Leads couldn’t load" body="Please try again in a moment."
    action={<Button variant="outline" onClick={() => { boundary.reset(); void router.invalidate(); }}>Try again</Button>} />;
}