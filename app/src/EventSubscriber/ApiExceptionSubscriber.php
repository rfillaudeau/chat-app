<?php

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Validator\ConstraintViolationListInterface;
use Symfony\Component\Validator\Exception\ValidationFailedException;

class ApiExceptionSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::EXCEPTION => [
                ['processException', 0]
            ],
        ];
    }

    public function processException(ExceptionEvent $event)
    {
        $exception = $event->getThrowable();

        if (get_class($exception) === ValidationFailedException::class) {
            $event->setResponse(new JsonResponse([
                'message' => 'validation_failed',
                'errors' => self::formatValidationErrors($exception->getViolations())
            ], Response::HTTP_UNPROCESSABLE_ENTITY));
        }

//        switch(get_class($exception)) {
//            case ValidationFailedException::class:
//                $message = 'validation_failed';
//                $errors = self::formatValidationErrors($exception->getViolations());
//
//                $httpCode = Response::HTTP_UNPROCESSABLE_ENTITY;
//                break;
//
//            case NotFoundHttpException::class:
//            default:
//                $httpCode = $exception instanceof HttpException ? $exception->getStatusCode() : 500;
//                $errors = [['message' => $exception->getMessage()]];
//        }
    }

    private static function formatValidationErrors(ConstraintViolationListInterface $violations): array
    {
        if (count($violations) === 0) {
            return [];
        }

        $errors = [];
        foreach ($violations as $violation) {
            $errors[] = [
                'property' => $violation->getPropertyPath(),
                'value' => $violation->getInvalidValue(),
                'message' => $violation->getMessage(),
            ];
        }

        return $errors;
    }
}
