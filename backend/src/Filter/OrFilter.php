<?php

namespace App\Filter;

use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\PropertyInfo\Type;

class OrFilter extends AbstractFilter
{
    protected function filterProperty(
        string                      $property,
        mixed                       $value,
        QueryBuilder                $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string                      $resourceClass, Operation $operation = null,
        array                       $context = []
    ): void
    {
        $parameterName = $this->getParameterName();
        if (!$this->getProperties() || $value === '' || $property !== $parameterName) {
            return;
        }

        $rootAlias = $queryBuilder->getRootAliases()[0];
        $queryParameterName = $queryNameGenerator->generateParameterName($parameterName);

        $queries = [];
        foreach (array_keys($this->getProperties()) as $prop) {
            if (!$this->isPropertyEnabled($prop, $resourceClass) || !$this->isPropertyMapped($prop, $resourceClass)) {
                return;
            }

            $queries[] = sprintf('%s.%s LIKE :%s', $rootAlias, $prop, $queryParameterName);
        }

        $queryBuilder
            ->andWhere('(' . implode(' OR ', $queries) . ')')
            ->setParameter($queryParameterName, '%' . $value . '%');
    }

    public function getDescription(string $resourceClass): array
    {
        if (!$this->properties) {
            return [];
        }

        return [
            $this->getParameterName() => [
                'property' => null,
                'type' => Type::BUILTIN_TYPE_STRING,
                'required' => false,
                'description' => 'Filter by ' . implode(' or ', array_keys($this->getProperties()))
            ]
        ];
    }

    private function getParameterName(): string
    {
        if (!$this->getProperties()) {
            return '';
        }

        $keys = array_keys($this->getProperties());
        $length = count($keys);

        $name = $keys[0];
        for ($i = 1; $i < $length; $i++) {
            $name .= sprintf('Or%s', ucfirst($keys[$i]));
        }

        return $name;
    }
}
