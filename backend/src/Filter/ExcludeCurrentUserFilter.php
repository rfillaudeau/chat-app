<?php

namespace App\Filter;

use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use App\Entity\User;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\PropertyInfo\Type;
use Symfony\Component\Serializer\NameConverter\NameConverterInterface;

class ExcludeCurrentUserFilter extends AbstractFilter
{
    private const PARAMETER_NAME = 'excludeCurrentUser';

    public function __construct(
        private readonly Security         $security,
        protected ManagerRegistry         $managerRegistry,
        LoggerInterface                   $logger = null,
        protected ?array                  $properties = null,
        protected ?NameConverterInterface $nameConverter = null
    )
    {
        parent::__construct($managerRegistry, $logger, $properties, $nameConverter);
    }

    protected function filterProperty(
        string                      $property,
        mixed                       $value,
        QueryBuilder                $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string                      $resourceClass,
        Operation                   $operation = null,
        array                       $context = []
    ): void
    {
        if (
            !self::isSupported($resourceClass)
            || $property !== self::PARAMETER_NAME
            || ($value !== '1' && $value !== 'true')
            || null === $user = $this->security->getUser()
        ) {
            return;
        }

        $rootAlias = $queryBuilder->getRootAliases()[0];
        $parameterName = $queryNameGenerator->generateParameterName('user');

        $queryBuilder
            ->andWhere(sprintf('%s <> :%s', $rootAlias, $parameterName))
            ->setParameter($parameterName, $user);
    }

    public function getDescription(string $resourceClass): array
    {
        if (!self::isSupported($resourceClass)) {
            return [];
        }

        return [
            self::PARAMETER_NAME => [
                'property' => null,
                'type' => Type::BUILTIN_TYPE_BOOL,
                'required' => false,
                'description' => 'Exclude the logged user from the results.',
            ]
        ];
    }

    private static function isSupported(string $resourceClass): bool
    {
        return User::class === $resourceClass;
    }
}
