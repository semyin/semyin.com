import { SetMetadata } from '@nestjs/common';

export const NO_RESPONSE_WRAPPER = 'no_response_wrapper';
export const NoResponseWrapper = () => SetMetadata(NO_RESPONSE_WRAPPER, true);