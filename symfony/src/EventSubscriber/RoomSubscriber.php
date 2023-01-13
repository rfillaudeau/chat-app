<?php

namespace App\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\Room;
use App\Service\MercurePublisher;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class RoomSubscriber implements EventSubscriberInterface
{
    public function __construct(private readonly MercurePublisher $mercurePublisher)
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => [
                ['publishToMercure', EventPriorities::POST_WRITE],
            ],
        ];
    }

    public function publishToMercure(ViewEvent $event)
    {
        $room = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!($room instanceof Room) || Request::METHOD_POST !== $method) {
            return;
        }

        $this->mercurePublisher->publishRoom($room);
    }
}
